import { Component, OnInit } from '@angular/core';
import { BleClient, BleDevice, numberToUUID } from '@capacitor-community/bluetooth-le';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AppSettings } from '../AppSettings';
import { FirmwareService } from '../services/firmware.service';

@Component({
  selector: 'app-device',
  templateUrl: './device.page.html',
  styleUrls: ['./device.page.scss'],
})
export class DevicePage implements OnInit {

  device: BleDevice
  softwareVersion: string
  hardwareVersion: string
  isFirstUpdateCheck: boolean = true

  constructor(
      private route: ActivatedRoute, 
      private router: Router,
      private toastCtrl: ToastController,
      private firmwareService: FirmwareService) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.device = this.router.getCurrentNavigation().extras.state.device;
        console.log('UUIDs: ' + this.device.uuids)
      }
    })
  }

  ngOnInit() {
    this.isFirstUpdateCheck = true
    this.readVersion().then(() => {
      this.getFirmwareVersions()
    })
  }

  disconnect() {
    BleClient.disconnect(this.device.deviceId).then(() => {
      console.log('Disconnected from device ')
      this.router.navigate([''])   
    }).catch((error) => {
      console.error('Unable to disconnect ' + error)
    })
  }

  async readVersion() {
    const result = await BleClient.read(
      this.device.deviceId,
      AppSettings.OTA_SERVICE_UUID,
      AppSettings.VERSION_CHAR_UUID,
    );
    this.hardwareVersion = 'v' + result.getUint8(0) + '.' + result.getUint8(1);
    this.softwareVersion = 'v' + result.getUint8(2) + '.' + result.getUint8(3) + '.' + result.getUint8(4);
    console.log('Hardware-Version: ' + this.hardwareVersion);
    console.log('Software-Version: ' + this.softwareVersion);
  }

  getFirmwareVersions() {
    this.firmwareService.getVersioninfo().subscribe(result => {
      console.log("Firmware: " + JSON.stringify(result))
      this.checkForUpdate(result);
    });
  }

  checkForUpdate(data) {
    let softwareVersionCount = 0;
    let latestCompatibleSoftware = data.firmware[softwareVersionCount]['software'];
    versionFindLoop:
      while (latestCompatibleSoftware !== undefined) {
        let compatibleHardwareVersion = "N/A"
        let hardwareVersionCount = 0
        while (compatibleHardwareVersion !== undefined) {
          if(data.firmware[softwareVersionCount] === undefined) {
            break versionFindLoop
          }
          compatibleHardwareVersion = data.firmware[softwareVersionCount]['hardware'][hardwareVersionCount++];
          if (compatibleHardwareVersion === this.hardwareVersion) {
            latestCompatibleSoftware = data.firmware[softwareVersionCount]['software']
            if (latestCompatibleSoftware !== this.softwareVersion) {
              console.log("latest compatible version: " + latestCompatibleSoftware)
              this.promptForUpdate(true, latestCompatibleSoftware)
              return
            }
            break versionFindLoop;
          }
        }
        softwareVersionCount++
      }
      if(!this.isFirstUpdateCheck) {
        this.promptForUpdate(false, this.softwareVersion)
      } else {
        this.isFirstUpdateCheck = false
      }
  }

  async promptForUpdate(isUpdateAvailable: boolean, version: string) {
    let toast
    if(isUpdateAvailable) {
        toast = await this.toastCtrl.create({
        header: 'Compatible update available - version ' + version,
        message: 'Do you want to update your rESCue device?',
        position: 'middle',
        color: 'warning',
        animated: true,
        buttons: [
          {
             //side: 'start',
            icon: 'checkmark-circle',
            text: 'Yes',
            handler: () => {
              console.log('Update clicked');
              let navigationExtras: NavigationExtras = {
                state: {
                  'deviceId': this.device.deviceId,
                  version
                }
              };
              this.router.navigate(['/update'], navigationExtras)   
            }
          }, {
            icon: 'close-circle',
            text: 'No',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          }
        ]
      })
    } else {
      toast = await this.toastCtrl.create({
        header: 'No compatible update available!',
        message: 'Your device is already running the latest version ' + version,
        color: 'primary',
        position: 'middle',
        buttons: [
          {
            text: 'OK',
            role: 'cancel'
          }
        ]
      })
    }
    toast.present();
  }
}
