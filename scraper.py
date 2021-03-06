import requests
import re
import os
from bs4 import BeautifulSoup as soup
import json
from flask import Flask

app2 = Flask(__name__)

@app2.route('/')
def home():
    return "To use, add '/target' after the above url. For example '/Blue_Russian' will scrape the Blue_Russian wikipage"

@app2.route("/<target>")
def wikiScraper(target):
    targetPage = requests.get("https://en.wikipedia.org/wiki/"+target)
    print("Target Article: ","https://en.wikipedia.org/wiki/"+target)

    data = soup(targetPage.content, 'html.parser')
    headers = []
    text = []
    headers.append("Main")

    # get main section and filter
    mainText = data.find('p', {'class':None}).text
    mainText = re.sub(r'\[.*?\]+', '', mainText)
    mainText = mainText.replace('\n', '')
    text.append(mainText)

    # Iteratively pull section titles and text
    for content in data.find_all('h2'):
        filtertext = content.text
        filtertext = re.sub(r'\[.*?\]+', '', filtertext)
        filtertext = filtertext.replace('\n', '')
        headers.append(filtertext)
        textBuilder = ''
        for elem in content.next_siblings:
            if elem.name == 'h2':
                break
            if elem.name == 'p':
                filtertext = elem.text
                filtertext = re.sub(r'\[.*?\]+', '', filtertext)
                filtertext = filtertext.replace('\n', '')
                textBuilder += filtertext
        text.append(textBuilder)

    # # Build JSON Object
    jsonText = {}

    for x in range(0, len(text)):
        jsonText[headers[x]] = text[x]

    jsonData = json.dumps(jsonText)

    response = app2.response_class(response=jsonData, status=200, mimetype="application/json")
    response.headers.add("Access-Control-Allow-Origin","*")
    return response

if __name__ == "__main__":
    port = int(os.environ.get('PORT', 4753))
    app2.run(port=port)
