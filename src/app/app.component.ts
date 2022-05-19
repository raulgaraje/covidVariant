import { Component } from '@angular/core';
import { Person } from './person';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'covidVariant';

  private batch = `98789979798999898976297895678998901989999969423689943239987234578999987410678966
  59899989897899929875456789989769312397899653212367894398765345699987654323599545
  45979998965998912976567896799998423456798764333456965599876766789998765438789639
  34568987654567893987678965439876534587899898745767896987987878898989887649898798
  23679998543467899998789876321987856698944987656898989876598989987878998956999987
  15679987652358998989898765443499979789123498769969678987499998796566899877898899
  03468987543467987678999876554988998991035679878954567898987897654345789989967798
  12347897654579876567899997769877687892146789989543238999876789766556899995456567
  23456798765678987789999769898865476789258893297658347899865678978969999874323456
  44569899896789299891299654987656365699967894098767456789764589999898998765412345`;
  // private batch = `298754567899997699
  // 459799989659989129
  // 345689876545678939
  // 236799985434678999
  // 156799876523589989
  // 034689875434679876`;

  people: Person[][];

  time = 0;

  mostContagious = 0;

  constructor() {
    this.people = this.batch.split('\n').map((p, i) => {
      return [...p.trim()].map((pp, j) => {
        return {
          x: i,
          y: j,
          value: parseInt(pp),
          status: pp === '9' ? 'vaccinated' : 'safe',
          infections: 0,
        } as Person;
      });
    });
    this.checkAll()
  }

  public checkAll() {
    this.resetStatus(true);
    const start = new Date();
    this.people.map((line) =>
      line.map((person) => {
        this.startInfection(person.x, person.y, person);
        this.resetStatus();
        if (this.mostContagious < person.infections) {
          this.mostContagious = person.infections;
        }
      })
    );
    const end = new Date();
    this.time = end.getMilliseconds() - start.getMilliseconds();
  }

  private resetStatus(resetInfection: boolean = false) {
    this.people.map((line) =>
      line.map((person) => {
        person.status = person.value === 9 ? 'vaccinated' : 'safe';
        if (resetInfection) {
          person.infections = 0;
        }
      })
    );
  }

  private infect(x: number, y: number, v: number): boolean {
    if (x < this.people.length && x >= 0) {
      if (y < this.people[x].length && y >= 0) {
        let next = this.people[x][y];
        if (
          next.status === 'infected' ||
          next.status === 'vaccinated' ||
          next.value <= v
        ) {
          return false;
        }
        next.status = 'infected';
        return true;
      }
    }
    return false;
  }

  clickInfection(x: number, y: number, person: Person) {
    this.resetStatus(true);
    person.status = person.value === 9 ? 'vaccinated' : 'infected';
    this.startInfection(x, y, person);
  }

  public startInfection(x: number, y: number, person: Person) {
    if (this.infect(x + 1, y, this.people[x][y].value)) {
      person.infections++;
      this.startInfection(x + 1, y, person);
    }
    if (this.infect(x - 1, y, this.people[x][y].value)) {
      person.infections++;
      this.startInfection(x - 1, y, person);
    }
    if (this.infect(x, y + 1, this.people[x][y].value)) {
      person.infections++;
      this.startInfection(x, y + 1, person);
    }
    if (this.infect(x, y - 1, this.people[x][y].value)) {
      person.infections++;
      this.startInfection(x, y - 1, person);
    }
  }
}
