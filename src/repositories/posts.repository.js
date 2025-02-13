import { prisma } from '../utils/prisma/index.js';

export class PostsRepository {
  async findAllPosts() {
    const posts = await prisma.posts.findMany();

    return posts;
  }

  async findPostById(postId) {
    const post = await prisma.posts.findUnique({
      where: { postId: +postId },
    });

    return post;
  }

  async createPost(nickname, password, title, content) {
    const createdPosts = await prisma.posts.create({
      data: {
        nickname,
        password,
        title,
        content,
      },
    });

    return createdPosts;
  }

  async updatePost(postId, password, title, content) {
    const updatedPost = await prisma.posts.update({
      where: {
        postId: +postId,
        password,
      },
      data: {
        title,
        content,
      },
    });

    return updatedPost;
  }

  async deletePost(postId, password) {
    const deletedPost = await prisma.posts.delete({
      where: {
        postId: +postId,
        password,
      },
    });

    return deletedPost;
  }
}
