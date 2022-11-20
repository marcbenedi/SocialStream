from flask import Flask,jsonify, request
import pandas as pd
import json
import time
import numpy as np
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

data = pd.read_pickle("data/nf.pkl")
nf_vs_ap_inds = pd.read_pickle("data/nf_vs_ap_inds.pkl")
nf_vs_ap_sim = np.load("data/nf_vs_ap_sim.npy")
ap_soup = pd.read_pickle("data/ap_soup.pkl")

users = {}

def get_recommendations(title,indices,other,cosine_sim):
    try:
        idx = indices[title].values[0]
    except:
        idx = indices[title]
    similarity_scores = list(enumerate(cosine_sim[idx]))
    similarity_scores= sorted(similarity_scores, key=lambda x: x[1], reverse=True)
    similarity_scores= similarity_scores[2:6]
    # (a, b) where a is id of movie, b is similarity_scores
    movies_indices = [ind[0] for ind in similarity_scores]
    movies = other.iloc[movies_indices]
    return movies

@app.route("/")
def hello():
    return "Hello World!"

def compute_match_score(genres,data):
    scores = np.zeros(len(data))
    for idx,k in enumerate(data.values):

        for g in k.split(","):
            if g in genres:
                scores[idx] += 1

    top5 = np.argpartition(scores, -5)[-5:]
    return top5

@app.route("/find/<name>")
def find(name):
    # return jsonify([{'name': 'show 1', 'platform': 'Amazon', 'url': 'https://google.com', 'image': 'https://i.imgur.com/s9NR21pl.png'}] * 5)
    ret = []
    elem = ap_soup[ap_soup["otitle"].str.contains(name,case=False)]
    if len(elem["url"]) > 0:
        link = elem["url"].item()
        try:
            posters = elem["posters"].item().split(",")[0]
        except Exception as e:
            print(e)
            posters = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJiT-UHSm6w0Jperb8SitpfoAKeMUE3uynPg5YO-2Drw&s"

        ret.append({"name":name,
                    "platform":elem["provider"].item(),
                    "url":link,
                    "image":posters}
                           )
    return jsonify(ret)


@app.route("/mood/<mood>")
def mood(mood):
    return "my mood is {}".format(str(mood))

@app.route("/related/<name>")
def related(name):
    ret = []
    recoms = get_recommendations(name,nf_vs_ap_inds,ap_soup,nf_vs_ap_sim)
    num_suggs = len(recoms)
    for k in range(num_suggs):
        ret.append({"name":recoms["otitle"].iloc[k],
                    "platform":recoms["provider"].iloc[k],
                    "url":recoms["url"].iloc[k],
                    "image":recoms["posters"].iloc[k] if (recoms["posters"].iloc[k]) != None else "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJiT-UHSm6w0Jperb8SitpfoAKeMUE3uynPg5YO-2Drw&s"}
                           )
        print(recoms["posters"].iloc[k])
    # print(ret)
    return jsonify(ret)


@app.route("/user/<name>", methods=['POST'])
def addUser(name):
    users[name] = {
                'name': name,
                'last_update': time.time(),
                'stream': {
                        'name': '',
                        'url': '',
                        'time': '',
                        'isPlaying': False
                    }
                }
    print(users)
    return json.dumps({'success':True}), 200, {'ContentType':'application/json'}

@app.route("/user/<name>", methods=['PUT'])
def updateUser(name):
    content = request.json

    key = content['url'][len('https://www.netflix.com/watch/'):]
    key = key.split('?')[0]
    medianame = ''
    if len(data[data['url'].str.contains(key)]) > 0:
        medianame = data[data['url'].str.contains(key)]['otitle'][0]

    users[name]['last_update'] = time.time()
    users[name]['stream']['name'] = medianame
    users[name]['stream']['url'] = content['url']
    users[name]['stream']['time'] = content['time']
    users[name]['stream']['isPlaying'] = content['isPlaying']
    print(users)
    return json.dumps({'success':True}), 200, {'ContentType':'application/json'} 

@app.route("/users", methods=['GET'])
def getUsers():
    result = []
    for _, v in users.items():
        result.append(v)
    return jsonify(result)


if __name__ == "__main__":
    app.run(debug=True)
