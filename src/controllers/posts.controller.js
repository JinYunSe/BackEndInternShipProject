export class PostsController {
  constructor(postsService) {
    this.postsService = postsService;
  }

  // 게시글 조회 API
  getPost = async (req, res, next) => {
    try {
      const posts = await this.postsService.findAllPosts();
      return res.status(200).json(posts);
    } catch (error) {
      next(error);
    }
  };

  // 게시글 생성 API
  createPost = async (req, res, next) => {
    try {
      const { nickname, password, title, content } = req.body;

      if (!nickname || !password || !title || !content) throw new Error('InvalidParamsError');

      const createdPost = await this.postsService.createPost(nickname, password, title, content);
      return res.status(201).json(createdPost);
    } catch (error) {
      next(error);
    }
  };

  // 게시글 상세 조회 API
  getPostById = async (req, res, next) => {
    try {
      const { postId } = req.params;

      const post = await this.postsService.findPostById(postId);

      return res.status(200).json(post);
    } catch (error) {
      next(error);
    }
  };

  updatePost = async (req, res, next) => {
    try {
      const { postId } = req.params;

      const { password, title, content } = req.body;

      const updatedPost = await this.postsService.updatePost(postId, password, title, content);

      return res.status(200).json(updatedPost);
    } catch (error) {
      next(error);
    }
  };

  deletePost = async (req, res, next) => {
    try {
      const { postId } = req.param;
      const { password } = req.body;

      const deletedPost = await this.postsService.deletePost(postId, password);

      return res.status(200).json(deletedPost);
    } catch (error) {
      next(error);
    }
  };
}
