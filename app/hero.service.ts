import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Hero } from './hero';

@Injectable()
export class HeroService {

  private heroesUrl = 'app/heroes'; // URL to web api
  private headers = new Headers({'Content-type' : 'application/json'});

  constructor(private http: Http) { }

  getHero(id: int): Promise<Hero> {
    return Promise.resolve( this.getHeroes().then(heroes => heroes.find( hero => hero.id == id )) );
  }

  getHeroes(): Promise<Hero[]> {
    return this.http.get(this.heroesUrl)
               .toPromise()
               .then(response => response.json().data as Hero[])
               .catch(this.handleError);
  }

  getHeroesSlowly(): Promise<Hero[]> {
  return new Promise<Hero[]>(resolve =>
    setTimeout(resolve, 2000)) // delay 2 seconds
    .then(() => this.getHeroes());
  }

  update(hero: Hero): Promise<Hero> {
    const url = `${this.heroesUrl}/${hero.id}`;

    return this.http
              .put(url, JSON.stringify(hero), {headers: this.headers})
              .toPromise()
              .then(() => hero)
              .catch(this.handleError);
  }

  create(name: string): Promise<Hero> {
      return this.http
                .post(this.heroesUrl, JSON.stringify( {name} ), this.headers)
                .toPromise()
                .then(res => res.json().data)
                .catch(this.handleError);
  }

  delete(id: int): Promise<any> {
    const url = `${this.heroesUrl}/${id}`;

    return this.http
              .delete(url, {headers: this.headers})
              .toPromise()
              .then( () => null )
              .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error ocurred', error); // for demo purposes only
    return Promise.reject(erro.message || error);
  }

}
