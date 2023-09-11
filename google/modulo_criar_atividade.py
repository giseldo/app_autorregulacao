# Copyright 2018 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# [START classroom_quickstart]
from __future__ import print_function

import os.path

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

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

def criar_atividade(creds, course_id):

    try:
        service = build('classroom', 'v1', credentials=creds)
        coursework = {
            'title': 'Tarefa 3',
            'description': '''Tarefa 3.''',
            'materials': [
                {'link': {'url': 'http://example.com/ant-colonies'}},
                {'link': {'url': 'http://example.com/ant-quiz'}},
                {'link': {'url': 'https://docs.google.com/forms/d/e/1FAIpQLSeUSDBh0czeWRazc4Ymw-bhKV5clhzQSBPnRU6z6NQiJSuzDg/viewform'}}
            ],
            'workType': 'ASSIGNMENT',
            'state': 'PUBLISHED',
        }
        coursework = service.courses().courseWork().create(courseId=course_id, body=coursework).execute()
        print(f"Assignment created with ID {coursework.get('id')}")
        
    except HttpError as error:
        print('An error occurred: %s' % error)


if __name__ == '__main__':
    creds = carregar_credenciais()
    criar_atividade(creds, "617087903681")

