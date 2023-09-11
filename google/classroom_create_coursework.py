from __future__ import print_function

import google.auth
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from oauth2client import file, client, tools

def classroom_create_coursework(course_id):

    """
    Creates the coursework the user has access to.
    Load pre-authorized user credentials from the environment.
    TODO(developer) - See https://developers.google.com/identity
    for guides on implementing OAuth2 for the application.
    """
    
    SCOPES = 'https://www.googleapis.com/auth/classroom.courses'
    store = file.Storage('storage.json')
    creds = store.get()
    flow = client.flow_from_clientsecrets('client_id.json', SCOPES)
    creds = tools.run_flow(flow, store)
    
    # creds, _ = google.auth.default()
    # pylint: disable=maybe-no-member

    try:
        service = build('classroom', 'v1', credentials=creds)
        coursework = {
            'title': 'Ant colonies',
            'description': '''Read the article about ant colonies
                              and complete the quiz.''',
            'materials': [
                {'link': {'url': 'http://example.com/ant-colonies'}},
                {'link': {'url': 'http://example.com/ant-quiz'}}
            ],
            'workType': 'ASSIGNMENT',
            'state': 'PUBLISHED',
        }
        coursework = service.courses().courseWork().create(
            courseId=course_id, body=coursework).execute()
        print(f"Assignment created with ID {coursework.get('id')}")
        return coursework

    except HttpError as error:
        print(f"An error occurred: {error}")
        return error


if __name__ == '__main__':
    # Put the course_id of course whose coursework needs to be created,
    # the user has access to.
    classroom_create_coursework("617087903681")