import { jest } from '@jest/globals';
import { PostsRepository } from '../../../src/repositories/posts.repository';

// Prisma 클라이언트에서는 아래 5개의 메서드만 사용합니다.
let mockPrisma = {
  posts: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

let postsRepository = new PostsRepository(mockPrisma);

describe('Posts Repository Unit Test', () => {
  // 각 test가 실행되기 전에 실행됩니다.
  beforeEach(() => {
    jest.resetAllMocks(); // 모든 Mock을 초기화합니다.
  });

  test('findAllPosts Method', async () => {
    const mockReturn = 'findMany String';
    mockPrisma.posts.findMany.mockReturnValue(mockReturn);

    const posts = await postsRepository.findAllPosts();

    //findMany와 findAllPosts가 같은지 비교
    expect(posts).toBe(mockReturn);

    // findMany 함수는 최종적으로 1번만 호출된다.
    expect(postsRepository.prisma.posts.findMany).toHaveBeenCalledTimes(1);
  });

  test('createPost Method', async () => {
    // 1 최종적으로 createPost 메서드의 반환값을 설정한다.
    const mockReturn = 'create Post Return String';
    // 2. createPost 메서드를 실행하기 위한 nickname, password, title, content 데이터를 전달한다.
    mockPrisma.posts.create.mockReturnValue(mockReturn);

    const createPostParams = {
      nickname: 'createPostNickname',
      password: 'createPostPassword',
      title: 'createTitle',
      content: 'createContent',
    };

    const createPostData = await postsRepository.createPost(
      createPostParams.nickname,
      createPostParams.password,
      createPostParams.title,
      createPostParams.content,
    );

    // create 메서드의 반환값은 Return 값과 동일하다.
    expect(createPostData).toEqual(mockReturn);

    // create 메서드는 1번만 실행된다.
    expect(mockPrisma.posts.create).toHaveBeenCalledTimes(1);

    // createPost 메서드를 실행할 때, create 메서드는 nickname, passowrd, title, content 순으로 나온다.
    expect(mockPrisma.posts.create).toHaveBeenCalledWith({
      data: {
        nickname: createPostParams.nickname,
        password: createPostParams.password,
        title: createPostParams.title,
        content: createPostParams.content,
      },
    });
  });
});
