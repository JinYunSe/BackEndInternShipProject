import { expect, jest } from '@jest/globals';
import { PostsService } from '../../../src/services/posts.service.js';

// PostsRepository는 아래의 5개 메서드만 지원하고 있습니다.
let mockPostsRepository = {
  findAllPosts: jest.fn(),
  findPostById: jest.fn(),
  createPost: jest.fn(),
  updatePost: jest.fn(),
  deletePost: jest.fn(),
};

// postsService의 Repository를 Mock Repository로 의존성을 주입합니다.
let postsService = new PostsService(mockPostsRepository);

describe('Posts Service Unit Test', () => {
  // 각 test가 실행되기 전에 실행됩니다.
  beforeEach(() => {
    jest.resetAllMocks(); // 모든 Mock을 초기화합니다.
  });

  test('findAllPosts Method', async () => {
    const samplePosts = [
      {
        postId: 1,
        nickname: 'test',
        title: 'dddd',
        createdAt: '2025-02-14T02:53:32.911Z',
        updatedAt: '2025-02-14T03:35:26.732Z',
      },
      {
        postId: 2,
        nickname: 'test',
        title: 'title',
        createdAt: '2025-02-14T03:35:24.882Z',
        updatedAt: '2025-02-14T03:35:24.882Z',
      },
    ];

    mockPostsRepository.findAllPosts.mockReturnValue(samplePosts);

    const allPost = await postsService.findAllPosts();

    // nickname ~ updatedAt 까지 모든 요소 존재 비교 및 정렬 순서도 동시 비교
    expect(allPost).toEqual(samplePosts.sort((a, b) => b.createdAt - a.createdAt));

    // 호출을 몇 번 했는지 비교
    expect(mockPostsRepository.findAllPosts).toHaveBeenCalledTimes(1);
  });

  test('deletePost Method By Success', async () => {
    // 1. null이 아닌지 검사 및 실행 횟수
    const samplePost = {
      postId: 2,
      nickname: 'test',
      title: 'title',
      content: '임시로 추가',
      password: '1234',
      createdAt: '2025-02-14T03:35:24.882Z',
      updatedAt: '2025-02-14T03:35:24.882Z',
    };

    mockPostsRepository.findPostById.mockReturnValue(samplePost);

    const deletePost = await postsService.deletePost(2, '1234');

    expect(mockPostsRepository.findPostById).toHaveBeenCalledTimes(1);
    expect(mockPostsRepository.findPostById).toHaveBeenCalledWith(samplePost.postId);
    // 2. 삭제 유무
    expect(mockPostsRepository.deletePost).toHaveBeenCalledTimes(1);
    expect(mockPostsRepository.deletePost).toHaveBeenCalledWith(
      samplePost.postId,
      samplePost.password,
    );

    // 3. password가 없는 객체인지 확인
    expect(deletePost).toEqual({
      postId: samplePost.postId,
      nickname: samplePost.nickname,
      title: samplePost.title,
      content: samplePost.content,
      createdAt: samplePost.createdAt,
      updatedAt: samplePost.updatedAt,
    });
  });

  test('deletePost Method By Not Found Post Error', async () => {
    const samplePost = null;

    mockPostsRepository.findPostById.mockReturnValue(samplePost);

    try {
      await postsService.deletePost(9999999, '9999999');
    } catch (error) {
      expect(mockPostsRepository.findPostById).toHaveBeenCalledTimes(1);
      expect(mockPostsRepository.findPostById).toHaveBeenCalledWith(9999999);

      expect(mockPostsRepository.deletePost).toHaveBeenCalledTimes(0);

      expect(error.message).toEqual('존재하지 않는 게시글입니다.');
    }
  });
});
