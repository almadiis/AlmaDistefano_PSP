import { Injectable } from '@angular/core';
import * as Stomp from 'stompjs';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import SockJS from 'sockjs-client';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private stompClient!: Stomp.Client;
  private messageSubject = new Subject<any>();
  private isConnectedSubject = new BehaviorSubject<boolean>(false);
  private API_URL = 'http://localhost:8080/api/mensajes';


  constructor(private http: HttpClient) { }



  conectar() {
    if (this.isConnectedSubject.value) {
      console.log('Ya estás conectado');
      return;
    }


    const socket = new SockJS('http://localhost:8080/chat-websocket');
    this.stompClient = Stomp.over(socket);


    this.stompClient.connect({}, (frame) => {
      console.log('Conectado: ' + frame);
      this.isConnectedSubject.next(true);


      this.stompClient.subscribe('/chat/mensaje', (message) => {
        const parsedMessage = JSON.parse(message.body);
        console.log('Mensaje recibido del servidor:', parsedMessage);
        this.messageSubject.next(parsedMessage);
      });
      
    }, (error) => {
      console.error('Error al conectar:', error);
    });
  }


  desconectar() {
    if (this.stompClient && this.isConnectedSubject.value) {
      this.stompClient.disconnect(() => {
        console.log('Desconectado del servidor');
        this.isConnectedSubject.next(false);
      });
    } else {
      console.log('No estás conectado');
    }
  }


  sendMessage(mensaje: any) {
    if (this.isConnectedSubject.value) {
      console.log('Mensaje a enviar:', mensaje);
      this.stompClient.send('/app/mensaje', {}, JSON.stringify(mensaje));
    } else {
      console.warn('No se puede enviar. No estás conectado.');
    }
  }
  



  getMessages() {
    return this.messageSubject.asObservable();
  }


  // Solicitar mensajes almacenados en el backend
  getMensajesGuardados() {
    return this.http.get<any[]>('http://localhost:8080/api/mensajes');
  }


  get conectado() {
    return this.isConnectedSubject.value;
  }


  // Recuperar mensajes pasados por username
  getMensajesPorUsuario(username: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/usuario/${username}`);
  }

}
