from flask import Flask, request, jsonify
from flask_cors import CORS
import pymysql

app = Flask(__name__)
CORS(app)

# 데이터베이스 연결 설정
conn = pymysql.connect(
    host='localhost',      # 또는 호스트 IP (다른 팀원이 접근 시엔 IP)
    user='team',           # DB 사용자명
    password='1234',       # 비밀번호
    db='kobis_movie',      # 데이터베이스 이름
    charset='utf8mb4',
    cursorclass=pymysql.cursors.DictCursor
)

@app.route('/api/movies', methods=['GET'])
def search_movies():
    args = request.args
    keyword = args.get('title', '')
    director = args.get('director', '')
    genre = args.get('genre', '')
    country = args.get('country', '')
    year_start = args.get('yearStart')
    year_end = args.get('yearEnd')

    query = """
        SELECT DISTINCT m.title, m.eng_title AS englishTitle, m.prod_year AS year,
                        m.type, m.status AS state, m.company,
                        GROUP_CONCAT(DISTINCT d.name) AS director,
                        GROUP_CONCAT(DISTINCT g.name) AS genre,
                        GROUP_CONCAT(DISTINCT n.name) AS country
        FROM movie m
        LEFT JOIN movie_director md ON m.mid = md.mid
        LEFT JOIN director d ON md.did = d.did
        LEFT JOIN movie_genre mg ON m.mid = mg.mid
        LEFT JOIN genre g ON mg.gid = g.gid
        LEFT JOIN movie_nation mn ON m.mid = mn.mid
        LEFT JOIN nation n ON mn.nid = n.nid
        WHERE 1=1
    """

    params = []

    # 제목 (한글/영문 모두 검색)
    if keyword:
        query += " AND (m.title LIKE %s OR m.eng_title LIKE %s)"
        params += [f"%{keyword}%", f"%{keyword}%"]

    if director:
        query += " AND d.name LIKE %s"
        params.append(f"%{director}%")

    if genre:
        query += " AND g.name LIKE %s"
        params.append(f"%{genre}%")

    if country:
        query += " AND n.name LIKE %s"
        params.append(f"%{country}%")

    if year_start:
        query += " AND m.prod_year >= %s"
        params.append(year_start)

    if year_end:
        query += " AND m.prod_year <= %s"
        params.append(year_end)

    query += " GROUP BY m.mid ORDER BY m.prod_year DESC"

    try:
        with conn.cursor() as cursor:
            cursor.execute(query, params)
            result = cursor.fetchall()
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
