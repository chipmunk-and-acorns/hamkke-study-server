import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, LessThan, MoreThan, Repository } from 'typeorm';
import { PostsModel } from './entities/posts.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post-dto';
import { PaginatePostDto } from './dto/paginate-post.dto';
import { PostType } from './const/type.const';
import { ENV_HOST, ENV_PROTOCOL } from 'src/common/const/env-keys.const';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostsModel)
    private readonly postsRepository: Repository<PostsModel>,
  ) {}

  async createPost(userId: number, createPostDto: CreatePostDto) {
    const newPost = this.postsRepository.create({
      ...createPostDto,
      user: { id: userId },
    });
    return await this.postsRepository.save(newPost);
  }

  async getPosts() {
    return await this.postsRepository.find({ relations: ['user'] });
  }

  async paginatePosts(dto: PaginatePostDto) {
    const where: FindOptionsWhere<PostsModel> = {};

    if (dto.where__id_less_than) {
      where['id'] = LessThan(dto.where__id_less_than);
    } else if (dto.where__id_more_than) {
      where['id'] = MoreThan(dto.where__id_more_than);
    }

    const posts = await this.postsRepository.find({
      where,
      order: {
        createdAt: dto.order__createdAt,
      },
      take: dto.take,
      relations: ['user'],
    });

    const lastItem =
      posts.length > 0 && posts.length === dto.take
        ? posts[posts.length - 1]
        : null;
    const nextUrl =
      lastItem &&
      new URL(`${process.env[ENV_PROTOCOL]}://${process.env[ENV_HOST]}/posts`);

    if (nextUrl) {
      for (const key of Object.keys(dto)) {
        if (dto[key]) {
          if (key !== 'where__id_more_than' && key !== 'where__id_less_ehan') {
            nextUrl.searchParams.append(key, dto[key]);
          }
        }
      }

      let key = null;

      if (dto.order__createdAt === 'ASC') {
        key = 'where__id_more_than';
      } else {
        key = 'where__id_less_than';
      }

      nextUrl.searchParams.append(key, lastItem.id.toString());
    }

    return {
      data: posts,
      cursor: {
        after: lastItem?.id ?? null,
      },
      count: posts.length,
      next: nextUrl?.toString() ?? null,
    };
  }

  async generatePosts(userId: number) {
    for (let i = 0; i < 100; i++) {
      const post = this.postsRepository.create({
        title: `임의로 생선된 포스트 ${i}`,
        content: `임의로 생성된 포스트 내용 ${i}`,
        recruitCount: 10,
        postType: PostType.STUDY,
        user: { id: userId },
        deadline: new Date(),
      });

      await this.postsRepository.save(post);
    }
  }

  async getPostByPostId(postId: number) {
    const post = await this.postsRepository.findOne({
      where: { id: postId },
      relations: ['user'],
    });

    if (!post) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }

    return post;
  }

  async updatePost(
    userId: number,
    postId: number,
    updatePostDto: UpdatePostDto,
  ) {
    const post = await this.postsRepository.findOne({
      where: { id: postId },
      relations: ['user'],
    });

    if (!post) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }

    if (userId !== post.user.id) {
      throw new UnauthorizedException('해당 게시글을 수정할 권한이 없습니다.');
    }

    const { title, content, postType, recruitCount, deadline } = updatePostDto;

    if (title) post.title = title;
    if (content) post.content = content;
    if (postType) post.postType = postType;
    if (recruitCount) post.recruitCount = recruitCount;
    if (deadline) post.deadline = deadline;

    return await this.postsRepository.save(post);
  }

  async deletePost(userId: number, postId: number) {
    const post = await this.postsRepository.findOne({ where: { id: postId } });

    if (!post) {
      throw new NotFoundException('해당 포스트를 찾을 수 없습니다.');
    }

    if (userId !== post.user.id) {
      throw new UnauthorizedException('해당 게시글을 삭제할 권한이 없습니다.');
    }

    return await this.postsRepository.delete({ id: postId });
  }
}
