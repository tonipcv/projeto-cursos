interface PandaPlayerInstance {
  loadButtonInTime: (options: { fetchApi: boolean }) => void;
}

interface PandaPlayerOptions {
  onReady: () => void;
  library_id?: string;
  video_external_id?: string;
  defaultStyle?: boolean;
}

interface PandaPlayerConstructor {
  new (videoId: string, options: PandaPlayerOptions): PandaPlayerInstance;
}

interface Window {
  PandaPlayer?: PandaPlayerConstructor;
} 