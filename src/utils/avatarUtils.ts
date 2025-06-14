
export const getDefaultAvatar = (userId: string) => {
  // สร้าง array ของรูปการ์ตูนน่ารัก
  const cuteAvatars = [
    `https://api.dicebear.com/7.x/adventurer/svg?seed=${userId}&backgroundColor=b6e3f4,c0aede,d1d4f9`,
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}&backgroundColor=b6e3f4,c0aede,d1d4f9`,
    `https://api.dicebear.com/7.x/big-smile/svg?seed=${userId}&backgroundColor=b6e3f4,c0aede,d1d4f9`,
    `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${userId}&backgroundColor=b6e3f4,c0aede,d1d4f9`,
  ];
  
  // ใช้ userId เพื่อเลือกรูปแบบสุ่มแต่คงที่
  const index = userId.charCodeAt(0) % cuteAvatars.length;
  return cuteAvatars[index];
};

export const getAvatarUrl = (avatarUrl: string | null, userId: string) => {
  return avatarUrl || getDefaultAvatar(userId);
};
