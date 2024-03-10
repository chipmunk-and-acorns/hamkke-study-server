import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostsModel } from './entities/posts.entity';
import { Repository } from 'typeorm';
import { PostType } from './const/type.const';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostsModel)
    private readonly postsRepository: Repository<PostsModel>,
  ) {}

  async createPost(
    userId: number,
    title: string,
    content: string,
    postType: PostType,
    recruitCount: number,
    deadline: Date,
  ) {
    const newPost = this.postsRepository.create({
      title,
      content,
      user: { id: userId },
      postType,
      deadline,
      recruitCount,
    });
    return await this.postsRepository.save(newPost);
  }

  async getPosts() {
    return await this.postsRepository.find({ relations: ['user'] });
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
    title?: string,
    content?: string,
    postType?: PostType,
    recruitCount?: number,
    deadline?: Date,
  ) {
    const post = await this.postsRepository.findOne({ where: { id: postId } });

    if (!post) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }

    if (userId !== post.user.id) {
      throw new UnauthorizedException('해당 게시글을 수정할 권한이 없습니다.');
    }

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
