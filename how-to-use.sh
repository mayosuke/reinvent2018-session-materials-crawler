node reinvent.js machine learning sagemaker alexa polly lex rekognition comprehend translate robomaker deepracer deeplens | jq . > session.json

node md.js ./session.json > session.md

cat session.json | jq '.[].abstract' > abstract.txt
cat session.json | jq '.[].title' > title.txt

# translation to Japanese(abstract-ja.json) has been done by Google Translate
# en, ja, [
# xxx, =GOOGLETRANSLATE(A2, A$1,B$1), =CONCATENATE("""",B2,""",")

# node md.js ./session.json abstract-ja.json > session.ja.md
