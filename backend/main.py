from flask import Flask,jsonify
import pandas as pd
import json
import time
import numpy as np
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# st = time.time()
# ap = pd.read_json("streampicker/ap.json")
# print("Amazon loaded in ", time.time() - st , " seconds")
st = time.time()
nf = pd.read_json("data/streampicker/nf.json")
print("Netflix loaded in ", time.time() - st , " seconds")
# st = time.time()
# dp = pd.read_json("streampicker/dp.json")
# print("Disney+ loaded in ", time.time() - st , " seconds")
data = {"Amazon Prime":{},
            "Disney+":{},
            "Netflix": nf.drop_duplicates(subset=["otitle"])}


for k in data.keys():
    if len(data[k]):
        # noposter = (data[k]["posters"]).str.contains("")
        # data[k] = data[k][noposter == False]
        # del data[k][noposter]
        unnamed = data[k]["otitle"] == ""
        data[k]["otitle"].loc[unnamed] = data[k][unnamed]["title"]

        # data[k].drop(data[k][noposter].index,inplace=True)
#preprocess:
#replace all the none values in original title as title
#
users = {"kerem":{},"marc":{}}

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
    # pass
@app.route("/find/<name>")
def find(name):
    ret = []
    for k in data.keys():

        if len(data[k]) > 0:
            elem = data[k][ data[k]["otitle"].str.contains(name,case=False)]
            if len(elem["url"]) > 0:
                link = elem["url"].item()
                try:
                    posters = elem["posters"].item().split(",")[0]
                except Exception as e:
                    print(e)
                    posters = "No poster available"

                platform = k
                ret.append([name,platform,link,posters])
    return jsonify(ret)


@app.route("/mood/<mood>")
def mood(mood):
    #maybe make it only one
    return "my mood is {}".format(str(mood))

@app.route("/related/<name>")
def related(name):

    ret = []
    for k in data.keys():
        if len(data[k]) > 0:
            elem = data[k][ data[k]["otitle"].str.contains(name,case=False)]
            my_genres = elem["genres"].item().split(",")

            filtered_data = data[k][data[k]["otitle"] != name]
            top5inds = compute_match_score(my_genres,filtered_data["genres"])
            top5matches = list(filtered_data["otitle"].iloc[top5inds].values)
            for match in top5matches:
                elem = data[k][ data[k]["otitle"].str.contains(match,case=False)]

                link = elem["url"].item()
                try:
                    posters = elem["posters"].item().split(",")[0]
                except Exception as e:
                    print(e)
                    posters = "No poster available"
                platform = k
                ret.append([match,platform,link,posters])

    # print(ret)
    return jsonify(ret)
if __name__ == "__main__":
    app.run(debug=True)
