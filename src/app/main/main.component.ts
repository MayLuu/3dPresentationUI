import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable, Subscriber } from 'rxjs';
import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  //log time
  timeExecution!: string;
  //checkExtension
  isObj: boolean = false;
  file!: any;
  fileExtension: string = '';
  fileString: string = "";
  localUrl!: any;
  f!: File;
  url!: any;
  //obj file
  //2dimension array
  arrayV: number[][] = new Array();
  arrayF: number[][] = new Array();

  //png file
  myImage!: Observable<any>;
  base64code!: any;

  handleClick() {
    const input = document.getElementById('file');
    input?.addEventListener('click', function fileChanged(event) {

    });
  }
  fileChanged(e: any) {
    this.file = e.target.files[0];
    this.localUrl = e.target.value;
    this.fileExtension = this.file.name.substring(this.file.name.indexOf(".") + 1);
    if (this.fileExtension === 'obj') {
      this.isObj = true;
      this.uploadObjDocument();
      this.loadObjFile();

    } else {
      this.isObj = false;
      this.uploadDocument();

    };
  }
  uploadObjDocument() {
    let fileReader = new FileReader();

    fileReader.onloadend = () => {
      // Entire file
      var reader = fileReader.result + "";

      //calculate time
      var start = new Date();
      var end!: any;

      // By lines
      var lines = reader.split('\n');

      //find 1st index of face
      var indexF = 1;
      while (indexF == 1) {
        for (var index = 0; index < lines.length; index++) {
          if (lines[index].indexOf('f') == 0) {
            indexF = index;
            break;
          };
        }
      }
      var line: string[];
      //arrayV
      for (var id = 0; id < lines.length - indexF; id++) {
        line = lines[id].split(" ");
        this.arrayV.push([Number(line[1]), Number(line[2]), Number(line[3])])
      }
      //arrayF
      for (var id = indexF; id < lines.length; id++) {
        line = lines[id].split(" ");
        this.arrayF.push([Number(line[1]), Number(line[2]), Number(line[3])])
      }
      end = new Date();
      this.timeExecution = end.getTime() - start.getTime() + ' ms';
      this.fileString = reader;

    };
    fileReader.readAsText(this.file);

  }

  uploadDocument() {
    this.convertToBase64(this.file);
  }

  convertToBase64(file: File) {
    const observable = new Observable((subscriber: Subscriber<any>) => {
      this.readFile(file, subscriber)
    })

    observable.subscribe((d) => {
      this.myImage = d
      this.base64code = d
    })
  }

  readFile(file: File, subscriber: Subscriber<any>) {
    const filereader = new FileReader();//đặt biến toàn bộ là chữ thường

    filereader.readAsDataURL(file);
    console.log(filereader)
    filereader.onload = () => {
      subscriber.next(filereader.result);

      subscriber.complete();
    }

    filereader.onerror = () => {
      subscriber.error()
      subscriber.complete()
    }
  }
  //3d file
  loadObjFile() {

    //create new file

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(95, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 250;
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(300, 300);
    document.body.appendChild(renderer.domElement);
    var controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;

    var keyLight = new THREE.DirectionalLight(new THREE.Color('hsl(0, 0%, 82%)'), 1.0);
    keyLight.position.set(-50, 0, 100);
    scene.add(keyLight);

    var objLoader = new OBJLoader();
    //read file
    const fileReader = new FileReader();
    let fileString: string = "";
    fileReader.onloadend = () => {
      var reader = fileReader.result + "";
      fileString = reader;
      console.log(this.file)
      this.f = new File([reader], 'src.obj');
      const url = window.URL.createObjectURL(this.f);
      this.url = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      objLoader.load(this.url.changingThisBreaksApplicationSecurity, function (object: any) {
        scene.add(object);
        object.position.y -= 60;

      });
    }
    fileReader.readAsText(this.file)

    var animate = function () {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();
  }



  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
  }


}
