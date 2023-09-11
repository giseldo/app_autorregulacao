from __future__ import print_function

import google.auth
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
import os.path

# If modifying these scopes, delete the file token.json.
SCOPES = [  'https://www.googleapis.com/auth/classroom.courses', 
            'https://www.googleapis.com/auth/drive.readonly.metadata', 
            'https://www.googleapis.com/auth/classroom.announcements',	
            'https://www.googleapis.com/auth/classroom.courses',
            'https://www.googleapis.com/auth/classroom.coursework.me',
            'https://www.googleapis.com/auth/classroom.coursework.students',
            'https://www.googleapis.com/auth/classroom.courseworkmaterials',
            'https://www.googleapis.com/auth/classroom.guardianlinks.students',
            'https://www.googleapis.com/auth/classroom.profile.emails',	
            'https://www.googleapis.com/auth/classroom.profile.photos',	
            'https://www.googleapis.com/auth/classroom.push-notifications',	
            'https://www.googleapis.com/auth/classroom.rosters',	
            'https://www.googleapis.com/auth/classroom.rosters.readonly',	
            'https://www.googleapis.com/auth/classroom.topics'] 

def carregar_credenciais():
    creds = None
    # The file token.json stores the user's access and refresh tokens, and is
    # created automatically when the authorization flow completes for the first
    # time.
    if os.path.exists('token.json'):
        creds = Credentials.from_authorized_user_file('token.json', SCOPES)
    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                'credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)
        # Save the credentials for the next run
        with open('token.json', 'w') as token:
            token.write(creds.to_json())
    return creds


def classroom_list_submissions(creds, course_id, coursework_id):

    submissions = []
    page_token = None

    try:
        service = build('classroom', 'v1', credentials=creds)
        while True:
            coursework = service.courses().courseWork()
            response = coursework.studentSubmissions().list(
                pageToken=page_token,
                courseId=course_id,
                courseWorkId=coursework_id,
                pageSize=10).execute()
            submissions.extend(response.get('studentSubmissions', []))
            page_token = response.get('nextPageToken', None)
            if not page_token:
                break

        if not submissions:
            print('No student submissions found.')

        print('Student Submissions:')
        for submission in submissions:
            print(f"Submitted at:"
                  f"{(submission.get('id'), submission.get('creationTime'))}")

    except HttpError as error:
        print(f"An error occurred: {error}")
        submissions = None
    return submissions


if __name__ == '__main__':
    classroom_list_submissions(carregar_credenciais(), 453686957652, 466086979658)