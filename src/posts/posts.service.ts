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
import { JoinType, PostType } from './const/type.const';
import { QuestionsService } from 'src/questions/questions.service';
import { ConfigService } from '@nestjs/config';
import { ENV_HOST, ENV_PROTOCOL } from 'src/common/const/env-keys.const';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostsModel)
    private readonly postsRepository: Repository<PostsModel>,
    private readonly questionsService: QuestionsService,
    private readonly configService: ConfigService,
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
    const where = this.createWhereFilter(dto);

    const query = this.postsRepository
      .createQueryBuilder('posts')
      .leftJoinAndSelect('posts.user', 'user')
      .leftJoinAndSelect('posts.stacks', 'stacks')
      .leftJoinAndSelect('posts.positions', 'positions')
      .where(where);

    if (dto.stacks.length > 0) {
      query.andWhere(
        'posts.id IN (SELECT p.id FROM posts p INNER JOIN posts_stacks ps ON p.id = ps.post_id WHERE ps.stack_id IN (:...stackIds))',
        { stackIds: dto.stacks },
      );
    }

    if (dto.positions.length > 0) {
      query.andWhere(
        'posts.id IN (SELECT p.id FROM posts p INNER JOIN posts_positions pp ON p.id = pp.post_id WHERE pp.position_id IN (:...positionIds))',
        { positionIds: dto.positions },
      );
    }

    const data = await query
      .orderBy('posts.createdAt', dto.order)
      .take(dto.take)
      .getMany();

    const lastItem = data[data.length - 1];

    let nextUrl = null;
    let lastPage = true;

    if (lastItem) {
      nextUrl = new URL(
        `${this.configService.get<string>(ENV_PROTOCOL)}://${this.configService.get<string>(ENV_HOST)}/posts`,
      );

      for (const key of Object.keys(dto)) {
        if (key !== 'id' && dto[key]) {
          if (Array.isArray(dto[key])) {
            dto[key].length > 0 && nextUrl.searchParams.append(key, dto[key]);
          } else {
            nextUrl.searchParams.append(key, dto[key]);
          }
        }
      }

      nextUrl.searchParams.append(
        'id',
        dto.order === 'ASC' ? lastItem.id + 1 : lastItem.id - 1,
      );
      lastPage = false;
    }

    return {
      data,
      info: {
        nextUrl: nextUrl && nextUrl.toString(),
        lastPage,
      },
    };
  }

  private createWhereFilter(dto: PaginatePostDto) {
    let where = 'TRUE';

    if (typeof dto.id === 'number') {
      const condition = dto.order === 'DESC' ? '<=' : '>=';
      where = `posts.id ${condition} ${dto.id}`;
    }

    return where;
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
      relations: [
        'user',
        'questions',
        'participations',
        'participations.user',
        'stacks',
        'positions',
      ],
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
