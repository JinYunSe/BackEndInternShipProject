import { prisma } from '../utils/prisma/index.js';

export class PostsRepository {
  async findAllPosts() {
    const posts = await prisma.posts.findMany();

    return posts;
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
}
