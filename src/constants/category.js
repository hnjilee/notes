// 특정 로직(hook) 전용이 아니고
// 앱 전체에서 사용하기 때문에
// 따로 파일을 분리해서 export

// 의미 있는 개념/규칙인 카테고리를 상수로 한 곳에서 관리
export const CATEGORY = {
  ALL: { value: 'ALL', label: '전체' },
  WORK: { value: 'work', label: '업무' },
  PERSONAL: { value: 'personal', label: '개인' },
  ETC: { value: 'etc', label: '기타' },
};
