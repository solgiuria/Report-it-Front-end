import { Component } from '@angular/core';
import {LandingHeader} from '../../components/header/landing-header';
import { Hero } from '../../components/hero/hero';
import { Categories } from '../../components/categories/categories';
import { Stats } from '../../components/stats/stats';
import { HowItWorks } from '../../components/how-it-works/how-it-works';
import { Features } from '../../components/features/features';
import { FinalSection } from '../../components/final-section/final-section';
import { LandingFooter } from '../../components/footer/landing-footer';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [LandingHeader, Hero, Categories, Stats, HowItWorks,Features, FinalSection, LandingFooter],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css',
})
export class LandingPage {

}
