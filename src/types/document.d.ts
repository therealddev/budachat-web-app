export interface BusinessDocument {
  id: number;
  embedding: number[];
  content: string;
  metadata: {
    source: string;
  };
  business_id: string;
}

export interface MatchDocument {
  id: number;
  similarity: number;
  content: string;
}
