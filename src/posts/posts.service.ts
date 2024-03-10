import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostsModel } from './entities/posts.model';
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
      userId,
      postType,
      deadline,
      recruitCount,
    });
    return await this.postsRepository.save(newPost);
  }

  async getPosts() {
    return await this.postsRepository.find();
  }

  async getPostByPostId(postId: number) {
    return await this.postsRepository.findOne({ where: { id: postId } });
  }

  async updatePost(
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

    if (title) post.title = title;
    if (content) post.content = content;
    if (postType) post.postType = postType;
    if (recruitCount) post.recruitCount = recruitCount;
    if (deadline) post.deadline = deadline;

    return await this.postsRepository.save(post);
  }

  async deletePost(postId: number) {
    return await this.postsRepository.delete({ id: postId });
  }
}
