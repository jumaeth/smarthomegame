import {StatsService} from "./StatsService";
import {RoomNames} from "../objects/RoomNames";
import {Game} from "../objects/Game";
import {Room} from "../objects/Room";
import {SmartDevice} from "../objects/SmartDevice";
import {StatsKeys} from "../objects/StatsKeys";
import {DeviceNames} from "@/objects/DeviceNames";

describe.skip("StatsService", () => {
  it("should generate a CSV string", () => {
    // Dummy-Objekte erstellen
    const device1 = new SmartDevice(DeviceNames.SMART_TV);
    const device2 = new SmartDevice(DeviceNames.SMART_TV);
    const device3 = new SmartDevice(DeviceNames.SMART_TV);
    const device4 = new SmartDevice(DeviceNames.SMART_TV);
    const device5 = new SmartDevice(DeviceNames.SMART_TV);
    const room1 = new Room(RoomNames.LIVINGROOM, [device1, device3]);
    const room2 = new Room(RoomNames.KITCHEN, [device2, device4, device5]);
    const game = new Game([room1, room2]);

    // Statistiken setzen
    device1.getStatBlock().setValue(StatsKeys.AMOUNT_OF_DEVICE_SESSIONS, "2");
    device2.getStatBlock().setValue(StatsKeys.AMOUNT_OF_DEVICE_SESSIONS, "3");
    device1.getStatBlock().setValue(StatsKeys.TIME_IN_DEVICE, "1000");
    device2.getStatBlock().setValue(StatsKeys.TIME_IN_DEVICE, "2000");
    device3.getStatBlock().setValue("Hallo", "Welt");
    device4.getStatBlock().setValue("Richtig beantwortet", "3");
    device4.getStatBlock().setValue("Falsch beantwortet", "5");
    device5.getStatBlock().setValue("Score", "1701");
    const statsService = new StatsService();
    const csv = statsService.generateCsvString(game);
    console.log("generated string:"); //Log statement for manual verification of csv string
    console.log(csv);
    expect(typeof csv).toBe("string");
    expect(csv.length).toBeGreaterThan(0);

  });
});