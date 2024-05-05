import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { PostsModel } from './entities/posts.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post-dto';
import { PaginatePostDto } from './dto/paginate-post.dto';
import { CommonService } from 'src/common/common.service';
import { JoinType, PostType } from './const/type.const';
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
    positions: number[],
    stacks: number[],
  ) {
    const newPost = this.postsRepository.create({
      ...createPostDto,
      user: { id: userId },
      stacks: stacks.map((id) => ({ id })),
      positions: positions.map((id) => ({ id })),
    });

    const createPost = await this.postsRepository.save(newPost);
    const postId = createPost.id;

    if (questions) {
      await Promise.all(
        questions.map(
          async (question) =>
            await this.questionsService.generateQuestions(postId, question),
        ),
      );
    }

    return createPost.id;
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
      relations: ['user', 'questions', 'participations', 'stacks', 'positions'],
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
      relations: ['user', 'questions'],
    });

    if (!post) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }

    if (userId !== post.user.id) {
      throw new UnauthorizedException('해당 게시글을 수정할 권한이 없습니다.');
    }

    let updatePost = { ...post } as DeepPartial<PostsModel>;

    const {
      title,
      content,
      postType,
      recruitCount,
      deadline,
      joinType,
      stacks,
      positions,
      questions,
    } = updatePostDto;

    if (post.title !== title) updatePost.title = title;
    if (post.content !== content) updatePost.content = content;
    if (post.postType !== postType) updatePost.postType = postType;
    if (post.recruitCount !== recruitCount)
      updatePost.recruitCount = recruitCount;
    if (post.deadline !== deadline) updatePost.deadline = deadline;
    if (post.joinType !== joinType) updatePost.joinType = joinType;

    updatePost = this.updateStacks(updatePost, stacks);
    updatePost = this.updatePositions(updatePost, positions);

    await this.updatePostQuestions(post, updatePost, questions);
    await this.postsRepository.save(updatePost);

    return updatePost.id;
  }

  async completePost(userId: number, postId: number) {
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

    if (!post.isRecruiting) {
      throw new BadRequestException('이미 모집완료 상태입니다.');
    }

    post.isRecruiting = false;

    await this.postsRepository.save(post);

    return true;
  }

  async deletePost(userId: number, postId: number) {
    const post = await this.postsRepository.findOne({
      where: { id: postId },
      relations: ['user'],
    });

    if (!post) {
      throw new NotFoundException('해당 포스트를 찾을 수 없습니다.');
    }

    if (userId !== post.user.id) {
      throw new UnauthorizedException('해당 게시글을 삭제할 권한이 없습니다.');
    }

    return await this.postsRepository.delete(postId);
  }

  updateStacks(updatePost: DeepPartial<PostsModel>, stacks: number[]) {
    if (Array.isArray(stacks) && stacks.length) {
      return {
        ...updatePost,
        stacks: stacks.map((id) => ({ id })),
      };
    }

    return updatePost;
  }

  updatePositions(updatePost: DeepPartial<PostsModel>, positions: number[]) {
    if (Array.isArray(positions) && positions.length) {
      return {
        ...updatePost,
        positions: positions.map((id) => ({ id })),
      };
    }

    return updatePost;
  }

  async updatePostQuestions(
    prevPost: PostsModel,
    updatePost: DeepPartial<PostsModel>,
    updateQuestions: string[],
  ) {
    const isChangeJoinTypeToInstant =
      prevPost.joinType === JoinType.REQUEST &&
      updatePost.joinType === JoinType.INSTANT;
    const isChangeJoinTypeToRequest =
      prevPost.joinType === JoinType.INSTANT &&
      updatePost.joinType === JoinType.REQUEST;
    const isSameRequestJoinType =
      prevPost.joinType === JoinType.REQUEST &&
      updatePost.joinType === JoinType.REQUEST;
    const isDiffQuestions =
      isSameRequestJoinType &&
      updateQuestions.reduce(
        (isDiff: boolean, question: string, idx: number) => {
          if (question !== prevPost.questions[idx]?.question) {
            isDiff = true;
          }
          return isDiff;
        },
        false,
      );

    if (
      !isChangeJoinTypeToInstant &&
      !isChangeJoinTypeToRequest &&
      !isDiffQuestions
    ) {
      return false;
    }

    if (isChangeJoinTypeToInstant || isDiffQuestions) {
      await Promise.all(
        prevPost.questions.map(async (question) => {
          await this.questionsService.deleteQuestion(question.id);
        }),
      );
      updatePost.questions = [];
    }

    const postId = updatePost.id;

    if (isChangeJoinTypeToRequest || isDiffQuestions) {
      const newQuestions = await Promise.all(
        updateQuestions.map(async (question) => {
          return await this.questionsService.generateQuestions(
            postId,
            question,
          );
        }),
      );
      updatePost.questions = newQuestions;
    }

    return true;
  }
}
