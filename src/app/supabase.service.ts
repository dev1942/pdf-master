import { Injectable } from '@angular/core';
import {
  AuthChangeEvent,
  AuthSession,
  createClient,
  Session,
  SupabaseClient,
  User,} from '@supabase/supabase-js'

import { environment } from 'src/environments/environment'
import { Profile } from './domain/interface/profile-model';
@Injectable({
  providedIn: 'root'
})
export class SupabaseService {

  private supabase: SupabaseClient
  _session: AuthSession | null = null

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey)
  }

  get session() {
    this.supabase.auth.getSession().then(({ data  }) => {
      this._session = data.session
    })
    return this._session
  }
  magicLinkLogin(email: string) {
    return this.supabase.auth.signInWithOtp({ email })
  }

  signUpWithOtp(email: string) {
    return this.supabase.auth.signInWithOtp({ email })
  }
  async getAllUser() {
    return   await this.supabase.auth.admin.listUsers()
      }

  profile(user: User) {
    return this.supabase
      .from('profiles')
      .select(`username, website, avatar_url`)
      .eq('id', user.id)
      .single()
  }
 async uploadFile(file: File) {
    return await this.supabase.storage.from('avatars').upload(file.name , file, {
      cacheControl: '3600',
      upsert: false,
    

    })
  }
  async downloadFile(path: string) {
    
return await this.supabase
.storage
.from('avatars')
.download(path, {
  transform: {
    width: 100,
    height: 100,
    quality: 80
  }
})

  }

  async getFiles() {
    // return await this.supabase.storage.from('files').list();
   return  await this.supabase
  .storage
  .from('avatars')
  .list('', {
    limit: 100,
    offset: 0,
    sortBy: { column: 'name', order: 'asc' },
    
  });
  }

  authChanges(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    return this.supabase.auth.onAuthStateChange(callback)
  }

  signIn(email: string) {
    return this.supabase.auth.signInWithOtp({ email })
  }

  //this is for login
  signInWithPass(email: string, password: string) {
    return this.supabase.auth.signInWithPassword({ email, password })
  }
//this is for registration
  signUp(email: string, password: string) {
    return this.supabase.auth.signUp({ email, password })
  }
  forgotPassword(email: string) {
    return this.supabase.auth.resetPasswordForEmail(email) ; 
  }
  resetPassword(token: string, password: string, confirmPassword: string) {
    throw new Error('Method not implemented.');
  }
  

  signOut() {
    return this.supabase.auth.signOut()
  }

  updateProfile(profile: Profile) {
    const update = {
      ...profile,
      updated_at: new Date(),
    }

    return this.supabase.from('profiles').upsert(update)
  }

  downLoadImage(path: string) {
    return this.supabase.storage.from('avatars').download(path)
  }

  uploadAvatar(filePath: string, file: File) {
    return this.supabase.storage.from('avatars').upload(filePath, file)
    
  }
  async signinwithgoogle(){return await this.supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  })
  }
}
