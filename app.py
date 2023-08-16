from flask import request, redirect
from flask import Flask, request, render_template

app = Flask(__name__)


@app.route('/')
def root():
    frame_request = request.headers.get('X-Frame-Request') == 'true'
    return render_template('index.html', frame_request=frame_request)


@app.route('/about')
def about():
    frame_request = request.headers.get('X-Frame-Request') == 'true'
    return render_template('about.html', frame_request=frame_request)


@app.route('/feedback', methods=['GET', 'POST'])
def feedback():
    frame_request = request.headers.get('X-Frame-Request') == 'true'
    if request.method == 'POST':
        # Handle the form submission here, accessing form data with request.form
        # Example: feedback_text = request.form['feedback_field_name']
        # You can save the data or do whatever you need with it

        # Redirect or render a response as needed
        return render_template('feedback.html', frame_request=frame_request, complete=True)
    return render_template('feedback.html', frame_request=frame_request, complete=False)


if __name__ == "__main__":
    app.run(debug=True, port=5001)
