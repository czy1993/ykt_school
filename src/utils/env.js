let baseUrl, roomUrl;

if (process.env.NODE_ENV === "development") {
  // baseUrl='http://192.168.0.141:8765'  //测试后台 钟承铭
  // baseUrl = "http://192.168.0.235:8765"; //测试后台 老王
  // baseUrl='http://192.168.0.169:8888'  //测试后台 阿超
  baseUrl = "http://119.97.150.23:14444";
  roomUrl = "http://localhost:8080";
  // roomUrl = "https://video.bxyun.cn";
} else if (process.env.NODE_ENV === "production") {
  // baseUrl= window.location.origin
  baseUrl = "http://119.97.150.23:14444";
  roomUrl = "https://video.bxyun.cn";
}
export { baseUrl, roomUrl };
