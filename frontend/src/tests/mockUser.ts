const mockUser = {
  id: '1',
  username: 'testuser',
  email: 'test@example.com',
  display_name: 'Test User',
  bio: 'Test bio',
  avatar_path: '/avatar.png',
  banner_path: '/banner.png',
  avatar_public_id: 'avatar123', // Added field
  banner_public_id: 'banner123', // Added field
  created_at: new Date().toISOString(),
};

export default mockUser;
