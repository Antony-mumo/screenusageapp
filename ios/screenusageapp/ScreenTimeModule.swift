import Foundation
import DeviceActivity
import React

@objc(ScreenTimeModule)
class ScreenTimeModule: NSObject {

    @objc
    func getUsage(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        print("getUsage called")
        let store = DeviceActivityReport()
        store.load { error in
            guard error == nil else {
                reject("E_LOAD_FAILED", "Failed to load Device Activity Report", error)
                return
            }

            var usageData: [String: TimeInterval] = [:]

            for application in store.allApplications {
                if let applicationData = store.applicationData(for: application) {
                    let totalUsage = applicationData.totalUsage
                    usageData[application] = totalUsage
                }
            }

            resolve(usageData)
        }
    }

    @objc
    static func requiresMainQueueSetup() -> Bool {
        return true
    }
}