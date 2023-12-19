import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatSnackBar} from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon'


import { FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Sku } from '../models/sku';
import { Order } from '../models/order';



@Component({
  standalone: true,
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, ReactiveFormsModule, MatFormFieldModule, MatButtonModule, MatFormFieldModule, MatSelectModule, MatInputModule, MatIconModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  
})


export class AppComponent implements OnInit{
  title = 'caor';

  //Hardcodeamos los valores de la database, pero le creamos una interface para que este tipada
  Database: Sku[] = [
    {sku: 1, pasillo: 1, precio: 10.00},
    {sku: 2, pasillo: 1, precio: 15.00},
    {sku: 3, pasillo: 1, precio: 4.00},
    {sku: 4, pasillo: 2, precio: 1.00},
    {sku: 5, pasillo: 2, precio: 2.00},
    {sku: 6, pasillo: 2, precio: 8.00},
  ]

  selectedSku: Sku;

  //Creamos el formulario que vincularemos para agregar un pedido a una orden 
  packageForm: FormGroup = new FormGroup ({
      sku: new FormControl (null, Validators.required),
      aisle: new FormControl<number> ({value: null, disabled: true}, Validators.required),
      price: new FormControl<number> ({value: null, disabled: true}, Validators.required),
      quantity: new FormControl<number> (null, Validators.required),
      type: new FormControl<string> ('', Validators.required),
      
  });

  //Aquí almacenaremos las ordenes del pedido
  orders: Order[]=[];

  constructor(
    private _fb: FormBuilder,
    private _snackBar: MatSnackBar,
  ) { }

  /**
   * ngOnInit
   */
  ngOnInit(): void {
  }


  /**
   * Precarga los datos pasillo y precio en el formulario al seleccionar el id del item
   * @param {number} skuValue el id del item en la base de datos que se ha seleccionado
   */
  selectedId(skuValue: number): void{
    let item: Sku = this.Database.find(({sku}) => sku == skuValue);
    //Precargamos los valores en el formulario  
    this.packageForm.get('price').setValue(item.precio);  
    this.packageForm.get('aisle').setValue(item.pasillo);  
    
  }

  /**
   *Funcion para agregar ordenes al pedido   
   */
  addOrder(): void{
    if (this.packageForm.valid){
      const order: Order = this.packageForm.getRawValue();
      this.orders.push(order);
      this.packageForm.reset();
      this.openSnackBar('Se agregó orden al pedido correctamente');  
    }

    else{
      this.packageForm.markAllAsTouched();
      this.openSnackBar('Ocurrió un error, favor de verificar');
    }
  }

  /**
   * Muestra mensaje en snackBar
   * @param {string} message mensaje a mostrar en el snackbar 
   */
  openSnackBar(message: string):void {
    this._snackBar.open(message, 'X', {duration:4000});   
  }

  /**
   * Recibe el número de una orden y quita esa orden del arreglo de los pedidos (orders)
   * @param {number} index indice del elemento del arreglo
   *  
   */
  deleteElement(index: number): void{
    this.orders.splice(index, 1);
    this.openSnackBar('La orden se eliminó con éxito');         
  }

}