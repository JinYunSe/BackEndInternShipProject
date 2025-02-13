import express from 'express';
import { PostsController } from '../controllers/posts.controller';

const router = express.Router();
const postsController = new PostsController(); // PostsController를 인스턴스화 시킨다.

/** 게시글 생성 API **/
router.post('/posts', postsController.createPost);

/** 게시글 조회 API **/
router.get('/posts', postsController.getPost);

export default router;
