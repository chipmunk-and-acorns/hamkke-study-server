import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostsModel } from './entities/posts.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post-dto';
import { PaginatePostDto } from './dto/paginate-post.dto';
import { CommonService } from 'src/common/common.service';
import { PostType } from './const/type.const';
import { QuestionsService } from 'src/questions/questions.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostsModel)
    private readonly postsRepository: Repository<PostsModel>,
    private readonly commonService: CommonService,
    private readonly questionsService: QuestionsService,
  ) {}

  async createPost(
    userId: number,
    createPostDto: CreatePostDto,
    questions: string[],
  ) {
    const newPost = this.postsRepository.create({
      ...createPostDto,
      user: { id: userId },
    });

    const createPost = await this.postsRepository.save(newPost);
    const postId = createPost.id;

    const createQuestions = await Promise.all(
      questions.map(
        async (question) =>
          await this.questionsService.generateQuestions(postId, question),
      ),
    );

    return { ...createPost, questions: createQuestions ?? [] };
  }

  async getPosts() {
    return await this.postsRepository.find({
      relations: ['user'],
    });
  }

  async paginatePosts(dto: PaginatePostDto) {
    return await this.commonService.paginate(
      dto,
      this.postsRepository,
      { relations: ['user'] },
      'posts',
    );
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
      relations: ['user', 'questions'],
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
