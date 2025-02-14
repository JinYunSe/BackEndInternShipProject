export class PostsService {
  constructor(postsRepository) {
    this.postsRepository = postsRepository;
  }

  findAllPosts = async () => {
    const posts = await this.postsRepository.findAllPosts();

    posts.sort((a, b) => {
      return b.createdAt - a.createdAt;
    });

    return posts.map((post) => {
      return {
        postId: post.postId,
        nickname: post.nickname,
        title: post.title,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      };
    });
  };

  findPostById = async (postId) => {
    const post = await this.postsRepository.findPostById(postId);

    return {
      postId: post.postId,
      nickname: post.nickname,
      title: post.title,
      content: post.content,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  };

  createPost = async (nickname, password, title, content) => {
    const createdPost = await this.postsRepository.createPost(nickname, password, title, content);

    return {
      postId: createdPost.postId,
      nickname: createdPost.nickname,
      title: createdPost.title,
      content: createdPost.content,
      createdAt: createdPost.createdAt,
      updatedAt: createdPost.updatedAt,
    };
  };

  updatePost = async (postId, password, title, content) => {
    const post = await this.postsRepository.findPostById(postId);
    if (!post) throw new Error('존재하지 않는 게시글입니다.');

    await this.postsRepository.updatePost(postId, password, title, content);

    const updatedPost = await this.postsRepository.findPostById(postId);

    return {
      postId: updatedPost.postId,
      nickname: updatedPost.nickname,
      title: updatedPost.title,
      content: updatedPost.content,
      createdAt: updatedPost.createdAt,
      updatedAt: updatedPost.updatedAt,
    };
  };

  deletePost = async (postId, password) => {
    const post = await this.postsRepository.findPostById(postId);
    if (!post) throw new Error('존재하지 않는 게시글입니다.');

    await this.postsRepository.deletePost(postId, password);

    return {
      postId: post.postId,
      nickname: post.nickname,
      title: post.title,
      content: post.content,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  };
}
