import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Import Validators
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CoreService } from '../core/core.service';
import { EmployeeService } from '../services/employee.service';

@Component({
  selector: 'app-emp-add-edit',
  templateUrl: './emp-add-edit.component.html',
  styleUrls: ['./emp-add-edit.component.scss'],
})
export class EmpAddEditComponent implements OnInit {
  empForm: FormGroup;

  roles: string[] = [
    'Admin',
    'User'
  ];

  constructor(
    private fb: FormBuilder,
    private empService: EmployeeService,
    private dialogRef: MatDialogRef<EmpAddEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private coreService: CoreService
  ) {

    this.empForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],      
      roles: ['', Validators.required],
     
    });
  }

  ngOnInit(): void {
    this.empForm.patchValue(this.data);
  }

  onFormSubmit(formvalues: any) {

    console.log(formvalues);

    if (this.empForm.valid) {
      if (this.data) {

        console.log(this.data);

        this.empService.updateEmployee(this.data.id, formvalues)
          .subscribe({
            next: (val: any) => {

              this.coreService.openSnackBar('Employee detail updated Successfully');
              this.dialogRef.close(true);
            },
            error: (err: any) => {
              console.error(err);
            },
          });

      } else {
        console.log(formvalues);

        this.empService.addEmployee(formvalues).subscribe({
          next: (val: any) => {

            this.coreService.openSnackBar('Employee added successfully');
            this.dialogRef.close(true);
          },

          error: (err: any) => {
            console.error(err);
          },
        });
      }
    }else {
      this.empForm.markAllAsTouched(); // Mark all fields to show errors if form is invalid
    }
  }
}
