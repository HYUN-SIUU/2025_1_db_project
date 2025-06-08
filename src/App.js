import React from 'react';
import MovieSearchApp from './movie_web'; // 확장자는 생략 가능

function App() {
  return (
    <div>
      <h1 style={{marginLeft: "20px"}}>영화 검색 서비스</h1>
      <MovieSearchApp />
    </div>
  );
}

export default App;
