import { Component, OnInit } from '@angular/core';
import { Hero } from './hero';
import { HeroDetailComponent } from './hero-detail.component';
import { HeroService } from './hero.service';
import { Router } from '@angular/router';

@Component({
  selector: 'my-heroes',
  styleUrls: ['app/heroes.component.html'],
  templateUrl: 'app/heroes.component.html'
})

export class HeroesComponent implements OnInit {
  heroes: Hero[];
  selectedHero: Hero;

  constructor(private heroService: HeroService, private router:Router) {
  }

  ngOnInit(): void {
    this.getHeroes();
  }

  onSelect(hero:Hero):void {
    this.selectedHero = hero;
  }

  getHeroes(): void {
    this.heroService.getHeroes().then(
      heroes => this.heroes = heroes
    );
  }

  add(name: string): void {
    name = name.trim();
    if (!name) return;

    this.heroService.create(name)
        .then(hero => {
          this.heroes.push(hero);
          this.selectedHero = null;
        })
  }

  delete(hero: Hero): void {
    this.heroService
        .delete(hero.id)
        .then( () => {
          this.heroes = this.heroes.filter( h => h !== hero);
          if (this.selectedHero === hero) { this.selectedHero = null; }
        });
  }

  gotoDetail(): void {
    this.router.navigate(['/detail', this.selectedHero.id]);
  }
}
