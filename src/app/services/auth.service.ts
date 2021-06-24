import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { NavController } from '@ionic/angular';
import * as firebase from 'firebase/app';
import { from, Observable, of } from 'rxjs';

import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: Observable<any>;

  constructor(private afAuth: AngularFireAuth, private db: AngularFirestore,
    private navigationController: NavController) { 
      this.user = this.afAuth.authState.pipe(
        switchMap(user => {
          if (user) {
            return this.db.doc(`users/${user.uid}`).valueChanges();
          } else {
            return of(null);
          }
        })
      )
    }

  signIn(credentials): Observable<any>{
    return from(this.afAuth.signInWithEmailAndPassword(credentials.email, credentials.password)).pipe(
      switchMap(user => {
        if (user) {
          return this.db.doc(`users/${user.user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    )
  }

  signUp(credentials) {
    return this.afAuth.createUserWithEmailAndPassword(credentials.email, credentials.password).then(data => {
      console.log('after register: ', data);
      let date = new Date();

      return this.db.doc(`users/${data.user.uid}`).set({ 
        name: credentials.name,
        email: credentials.email,
        role: credentials.role,
        created: date // may need changing with .toString()
      })
    })
  }

  signOut() {
    this.afAuth.signOut().then(() => {
      this.navigationController.navigateRoot('/');
    });
  }

  async getEmail() {
    return (await this.afAuth.currentUser).email;
  }

  async getEmails() {
    const email = ((await this.afAuth.currentUser).email).toString();
    return email;
    //return this.afAuth.currentUser
  }
}
