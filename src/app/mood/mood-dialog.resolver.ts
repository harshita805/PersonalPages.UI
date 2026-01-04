import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MoodDialogComponent } from './mood-dialog.component';

export const moodDialogResolver: ResolveFn<boolean> = () => {
  const dialog = inject(MatDialog);

  dialog.open(MoodDialogComponent, {
    width: '400px',
    disableClose: true
  });

  // Resolver must return something
  return true;
};
