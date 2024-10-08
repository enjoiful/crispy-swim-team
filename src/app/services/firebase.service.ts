// firebase.service.ts
import { Injectable } from '@angular/core';
import { Database, query, orderByChild, startAt, endAt, ref, set, get, child, push, getDatabase, onValue, equalTo } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { inject } from '@angular/core';


@Injectable({
  providedIn: 'root'
})

export class FirebaseService {
  constructor(private db: Database) {}
  

  // Get sessions between the provided start and end epoch times (in milliseconds)
  getSessionsBetweenEpochs(startEpoch: number, endEpoch: number): Observable<any[]> {
    const dbRef = ref(this.db, 'session-overview');

    // Create a query to filter sessions where 'startepoch' is between start and end times
    const sessionQuery = query(
      dbRef,
      orderByChild('startepoch'),
      startAt(startEpoch),
      endAt(endEpoch)
    );

    // Create an observable to watch for data changes
    return new Observable((observer) => {
      onValue(sessionQuery, (snapshot) => {
        const sessions = snapshot.val();

        // Convert the object into an array and sort by 'startepoch'
        const sessionArray = Object.keys(sessions || {}).map(key => ({
          id: key,
          ...sessions[key]
        })).sort((a, b) => b.startepoch - a.startepoch);

        // Emit the filtered sessions
        observer.next(sessionArray);
      }, 
      (error) => {
        observer.error(error);
      });
    });
  }
  // Method to return all sessions for a given userId as an Observable
  getSessionsForUser(userId: number): Observable<any[]> {
    const dbRef = ref(this.db, 'session-overview'); // Adjust to your actual Firebase path

    // Create a query to filter sessions where 'user/id' equals the provided userId
    const userSessionsQuery = query(dbRef, orderByChild('user/id'), equalTo(userId));

    // Create an observable to watch for data changes
    return new Observable((observer) => {
      onValue(userSessionsQuery, (snapshot) => {
        const sessions = snapshot.val();

        // Convert the object into an array and sort by 'startepoch' or any other field as needed
        const sessionArray = Object.keys(sessions || {}).map(key => ({
          id: key,
          ...sessions[key]
        }));

        // Emit the filtered sessions
        observer.next(sessionArray);
      }, 
      (error) => {
        observer.error(error);
      });
    });
  }


}