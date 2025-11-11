import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-final-section',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './final-section.html',
  styleUrl: './final-section.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinalSection {

}
