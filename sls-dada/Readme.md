# Serverless
> AWS Lambda 함수를 만들어줍니다.

## 초기 설정
[공식 문서](https://www.serverless.com/framework/docs/getting-started/)
> node, npm이 설치되어있는지 확인하자.
1. Serverless 설치 `npm install -g serverless`
2. AWS Credential 설정 `sls config credentials -p aws -k {키} -s {시크릿 키}`
   ; 키는 notion에

## 코드 수정 후
1. 배포 `sls deploy`