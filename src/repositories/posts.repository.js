export class PostsRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  findAllPosts = async () => {
    const posts = await this.prisma.posts.findMany();

    return posts;
  };

  findPostById = async (postId) => {
    const post = await this.prisma.posts.findUnique({
      where: { postId: +postId },
    });

    return post;
  };

  createPost = async (nickname, password, title, content) => {
    const createdPosts = await this.prisma.posts.create({
      data: {
        nickname,
        password,
        title,
        content,
      },
    });

    return createdPosts;
  };

  updatePost = async (postId, password, title, content) => {
    const updatedPost = await this.prisma.posts.update({
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
  };

  deletePost = async (postId, password) => {
    const deletedPost = await this.prisma.posts.delete({
      where: {
        postId: +postId,
        password,
      },
    });

    return deletedPost;
  };
}
