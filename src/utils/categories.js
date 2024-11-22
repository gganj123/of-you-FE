// categories.js
export const categories = {
  WOMEN: ['OUTER', 'DRESS', 'SHIRT', 'T-SHIRT', 'PANTS'],
  MEN: ['OUTER', 'KNIT', 'SHIRT', 'T-SHIRT', 'PANTS'],
  BEAUTY: ['SKINCARE', 'MAKEUP', 'HAIR & BODY', 'MEN BEAUTY', 'INNER BEAUTY'],
  LIFE: ['HOME', 'TRAVEL', 'CULTURE']
};

export const categoriesMap = {
  WOMEN: '여성',
  MEN: '남성',
  BEAUTY: '뷰티',
  LIFE: '라이프',
  OUTER: '아우터',
  DRESS: '원피스',
  SHIRT: '셔츠',
  'T-SHIRT': '티셔츠',
  PANTS: '팬츠',
  KNIT: '니트',
  SKINCARE: '스킨케어',
  MAKEUP: '메이크업',
  'HAIR & BODY': '헤어바디',
  'MEN BEAUTY': '맨뷰티',
  'INNER BEAUTY': '이너뷰티',
  HOME: '홈',
  TRAVEL: '트래블',
  CULTURE: '컬쳐'
};

export const getCategoryName = (categoryKey) => {
  return categoriesMap[categoryKey?.toUpperCase()] || categoryKey;
};

// 서브카테고리 키를 한글로 변환
export const getSubcategoryName = (subcategoryKey) => {
  return categoriesMap[subcategoryKey?.toUpperCase()] || subcategoryKey;
};
