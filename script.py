import time
import sys
import requests
from watchdog.observers import Observer 
from watchdog.events import FileSystemEventHandler

class Watcher:
    DIRECTORY = "./uploads"

    def __init__(self):
        self.observer = Observer()

    def run(self):
        event_handler = Handler()
        self.observer.schedule(event_handler, self.DIRECTORY, recursive=True)
        self.observer.start()
        try:
            while True:
                time.sleep(5)
        except:
            self.observer.stop()
            print "Error"
        self.observer.join()

class Handler(FileSystemEventHandler):
    @staticmethod
    def on_any_event(event):
        if event.is_directory:
            return None
        elif event.event_type == 'created':
            r = requests.get(url = 'http://localhost:8080')
            f = open("demofile2.txt", "a")
            f.write(r.text)
            f.close()

if __name__ == '__main__':
    w = Watcher()
    w.run()



