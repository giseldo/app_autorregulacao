from __future__ import print_function

from googleapiclient import discovery
from httplib2 import Http
from oauth2client import file, client, tools

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

store = file.Storage('token.json')
creds = store.get()
flow = client.flow_from_clientsecrets('client_id.json', SCOPES)
creds = tools.run_flow(flow, store)

#Classroom = discovery.build('classroom', 'v1', http=creds.authorize(Http()))

