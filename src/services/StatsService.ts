import {Game} from "../objects/Game";
import {Room} from "../objects/Room";
import {SmartDevice} from "../objects/SmartDevice";
import {statisticsDisplayName, StatsKeys} from "../objects/StatsKeys";
import {deviceDisplayName, deviceNameToEnum} from "@/objects/DeviceNames";
import {roomDisplayName, roomNameToEnum} from "@/objects/RoomNames";

export class StatsService {
  private CSV_SEPARATOR: string = ";";
  private LINE_BREAK: string = "\n";

  // Slice Operation on each line to remove the superfluous last collumn
  generateCsvString(game: Game): string {
    let csvString: string = "";
    const allDevices = game.getRooms().flatMap(room => room.devices);

    csvString += this.generateRoomsLine(game.getRooms()) + this.LINE_BREAK;
    csvString += this.generateDevicesNamesLine(allDevices) + this.LINE_BREAK;
    csvString += this.generateCommonValuesLines(allDevices);
    csvString += this.generateDeviceSpecificValuesLines(allDevices);


    return csvString;
  }

  generateRoomsLine(rooms: Room[]): string {
    let roomLine: string = "";
    rooms.forEach(room => {
      const amountOfDevices = room.devices.length;
      const roomEnum = roomNameToEnum(room.name);
      if (!roomEnum || amountOfDevices === 0) {
        return;
      }
      const roomName: string = roomDisplayName[roomEnum]();
      roomLine += roomName + this.CSV_SEPARATOR.repeat(amountOfDevices * 2);
    })
    return roomLine.slice(0, -1);
  }

  generateDevicesNamesLine(devices: SmartDevice[]): string {
    let deviceNamesLine: string = "";
    devices.forEach(device => {
      const deviceEnum = deviceNameToEnum(device.name);
      if (!deviceEnum) {
        return;
      }
      const deviceName: string = deviceDisplayName[deviceEnum]();
      deviceNamesLine += deviceName + this.CSV_SEPARATOR.repeat(2);
    })
    return deviceNamesLine.slice(0, -1);
  }

  generateCommonValuesLines(devices: SmartDevice[]): string {
    let commonValuesLines: string = "";
    commonValuesLines += this.generateLineForStatKey(devices, StatsKeys.AMOUNT_OF_DEVICE_SESSIONS) + this.LINE_BREAK;
    commonValuesLines += this.generateLineForStatKeyWithMiliValues(devices, StatsKeys.TIME_IN_DEVICE) + this.LINE_BREAK;
    return commonValuesLines;
  }

  generateLineForStatKeyWithMiliValues(devices: SmartDevice[], statKey: StatsKeys): string {
    let line: string = "";
    const statKeyName: string = statisticsDisplayName[statKey]();

    devices.forEach(device => {
      const value: number = Number(device.getStatBlock().findByName(statKey));
      line += statKeyName + this.CSV_SEPARATOR;
      line += (value / 1000) + this.CSV_SEPARATOR;
    })
    return line.slice(0, -1);
  }

  generateLineForStatKey(devices: SmartDevice[], statKey: StatsKeys): string {
    let line: string = "";
    const statKeyName = statisticsDisplayName[statKey]();

    devices.forEach(device => {
      line += statKeyName + this.CSV_SEPARATOR;
      line += device.getStatBlock().findByName(statKey) + this.CSV_SEPARATOR;
    })
    return line.slice(0, -1);
  }

  generateDeviceSpecificValuesLines(devices: SmartDevice[]): string {
    const deviceSpecificValuesLines: string[] = [];
    const ammountOfLines: number = devices.reduce((max, device) => {
      const statCount = device.getStatBlock().getValuesReadOnly().size;
      return Math.max(max, statCount);
    }, 0);

    devices.forEach(device => {
      let i: number = 0;
      device.statBlock?.getValuesReadOnly().forEach((value: string, key: string | StatsKeys) => {
        if (!Object.values(StatsKeys).includes(key as StatsKeys)) {
          if (deviceSpecificValuesLines.length <= i) {
            deviceSpecificValuesLines.push("");
          }
          deviceSpecificValuesLines[i] += key + this.CSV_SEPARATOR;
          deviceSpecificValuesLines[i] += value + this.CSV_SEPARATOR;
          i++;
        }
      })

      while (i < ammountOfLines - 1) {
        deviceSpecificValuesLines[i] += this.CSV_SEPARATOR + this.CSV_SEPARATOR;
        i++;
      }
    })
    return deviceSpecificValuesLines.map(line => line.slice(0, -1)).join(this.LINE_BREAK);
  }
}