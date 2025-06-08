import React, { Component } from 'react';
import './movie_web.css';

class MovieSearchApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            country: '',
            genre: '',
            director: '',
            yearStart: '',
            yearEnd: '',
            results: []
        };
    };

    renderYearOptions() {
        const years = [];
        for (let y = 1925; y <= 2025; y++) {
            years.push(<option key={y} value={y}>{y}</option>);
        }
        return years;
    };

    handleInputChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    };

    handleSearch = () => {
        const { title, country , genre, director, yearStart, yearEnd } = this.state;

        console.table({
            영화명: title,
            제작국가: country,
            장르: genre,
            감독명: director,
            제작연도_시작: yearStart,
            제작연도_끝: yearEnd
        });

        if (
            !title.trim() &&
            !country.trim() &&
            !genre.trim() &&
            !director.trim() &&
            !yearStart &&
            !yearEnd
        ) {
            alert('하나 이상의 조건을 입력해주세요.');
            return;
        }

        if (yearStart && yearEnd && parseInt(yearStart) > parseInt(yearEnd)) {
            alert('제작연도 기간을 확인해주세요.');
            return;
        }
       
        const query = `title=${title}&country=${country}&genre=${genre}&director=${director}&yearStart=${yearStart}&yearEnd=${yearEnd}`;

        fetch(`https://2025dbproject.netlify.app/api/movies?${query}`)
            .then((res) => res.json())
            .then((data) => {
                this.setState({ results: data });
            })
        .catch((error) => {
            console.error('에러 발생:', error);
            this.setState({ results: [] });
        });
    };

    handleReset = () => {
        this.setState({
            title: '',
            country: '',
            genre: '',
            director: '',
            yearStart: '',
            yearEnd: '',
            results: []
        });
    };

    render() {
        const { title, country , genre, director, yearStart, yearEnd, results } = this.state;

        return (
        <div className="container">
            <div className="input-grid">
                <input
                    name="title"
                    value={title}
                    placeholder="영화명"
                    onChange={this.handleInputChange}
                />
                <input
                    name="country"
                    value={country}
                    placeholder="제작 국가"
                    onChange={this.handleInputChange}
                />
                <input
                    name="genre"
                    value={genre}
                    placeholder="장르"
                    onChange={this.handleInputChange}
                />
                <input
                    name="director"
                    value={director}
                    placeholder="감독명"
                    onChange={this.handleInputChange}
                />
                <div className="year-range">
                    <label>제작연도</label>
                    <select name="yearStart" value={yearStart} onChange={this.handleInputChange}>
                        <option value="">시작</option>
                        {this.renderYearOptions()}
                    </select>
                    ~
                    <select name="yearEnd" value={yearEnd} onChange={this.handleInputChange}>
                        <option value="">끝</option>
                        {this.renderYearOptions()}
                    </select>
                </div>
            </div>

            <div className="button-group">
                <button onClick={this.handleSearch}>조회</button>
                <button onClick={this.handleReset}>초기화</button>
            </div>

            <table className="result-table">
                <thead>
                    <tr>
                    <th>영화명</th>
                    <th>영화명 (영문)</th>
                    <th>제작연도</th>
                    <th>제작국가</th>
                    <th>유형</th>
                    <th>장르</th>
                    <th>제작상태</th>
                    <th>감독</th>
                    <th>제작사</th>
                    </tr>
                </thead>
                <tbody>
                    {results.length === 0 ? (
                        <tr>
                            <td colSpan="9" className="no-result">결과가 없습니다.</td>
                        </tr>
                    ) : (
                        results.map((movie, idx) => (
                            <tr key={idx}>
                                <td>{movie.title}</td>
                                <td>{movie.englishTitle}</td>
                                <td>{movie.year}</td>
                                <td>{movie.country}</td>
                                <td>{movie.type}</td>
                                <td>{movie.genre}</td>
                                <td>{movie.state}</td>
                                <td>{movie.director}</td>
                                <td>{movie.company}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
        );
    }
}

export default MovieSearchApp;
