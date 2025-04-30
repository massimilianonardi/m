package m.store;

import m.object.*;
import m.node.*;
import m.file.*;
import m.stream.*;

/*
id is not mandatory, but should be implemented as universally-unique (public-node-id + local-unique-id) or at least initially locally-unique

node copy copies object and/or children and/or parents, object as file sealed has the copy on write feature
node move is removing from a node's links and put elsewhere
node rename is renaming of its link
node delete is removing its parent links and eventually remove from store

attributes are similar to tags, but can have value -> more filtering allowed
to add node attributes (creation/modification time, creator, signatures, etc.), suffices to overlay another node system, or 
add a node with path attributes that links attributes data and manually updated, or extended interface
all the above is data-centric and store oriented, now need something processing-oriented -> neuron as node extension

maximum generalization: node-processor = node-data-store + f(node-object, parents-stream)->childrens-stream
neuron is a node with a transfer function: inputs = node-object + parents, outputs = node-object + children
where its transfer function is parametric on the number of parents and has a scalar weight for each children
processor is more general. the concept is unilateral branches as inputs and outputs, 
an algorithm that: transforms them, changes its internal state (node-object) and create/removes branches
ie a server that accepts/refuses requests and creates responses (single anon request is temp branch, session creation is more abstract)
ie a neuron that transforms inputs to outputs and prunes unneeded synapses

data flows on branches as streams -> node-object as stream, data+cmds flow as streams -> complex structs need de/serialization
implies that user and data generators or data consumers are seen as node

processor:
a node requests to another node to accept an unilateral link/connection/branch (in node-store it is autoaccepted in list/map)
if accepted then requestor can send data-streams over that connection (in node-store instead allows to acces internal object)
-> node-store and node-processor are completely separated interfaces even if both allows modification of internal obj in/directly

revpath at this time seems not to be very useful, but it is required for duality at least.
path is often used as absolute path (starting from a reference node called "root").
thus for speed is convenient to use a cache made of filesystem dirs and relative symlinks to its dirs or nodes.
thus node-store is similar to file-store but with more methods to manage branches

absoluteness/relativeness of a path is bound to a node-system, ie: a path can be absolute to a pc, but relative inside the net pc is in
-> m-net is the universal public net where nodes of all universe should connect -> the master reference network!!!
-> m-path: an absolute path of the m-net
-> node-store-fs + node-store-net, where node-store-net is based on other node-stores (nb net can be a pc with many fsnodes or internet)

stream sealable created from a streaminput and generates seal/hash
store sealable compose 2 stores: 1 purely sealed, 1 editable -> when asked to seal, then is moved to sealed store -> api knows intrinsecally what store to ask/put specific id
also store node implementations should use other store interfaces to wrap 
(eg. 1 store for objects as files, 1 store for json paths and multimaps, or 1 for files and 1 file as hsql/h2 db or table with all links)
seal/hash for node should be only obj+paths, not parents...unless it is intended that exernal link means object has "changed", which is more control
version control can use bilateral-blockchain to keep track of single file changes (save new hash together with previous hash and indexed by previous??? snf newer has older also)

each store-node offers 2 file services: files by hash for sealed files, files by id for index files (with timestamp info and e-signature+time)
each store-node offers 1 node service: nodes by id
partitioned index files by hash may not have esig

node -> file-id -> versioned-file-hash -> multiple part-hash -> multiple cluster-id (one per each part) -> current-ip-address of cluster-clients
[node -> file-id] is the primary index and can be largely cached
[file-id -> versioned-file-hash -> multiple part-hash] + [file/part-hash -> cluster-id] largely decentralized
[cluster-id -> current-ip-address of cluster-clients] largely decentralized
problem: from file-id search where to get remaining infos (file-id -> ip-address)
solution: partition deeper index and ensure connection with at least one ip for each part so that can be queried all indexes
-> since store-node can use internally only store-file, need an implementation od store-file as union of other store-file that control only 
a partition, then these stores implement versioning and file-partitioning
then global files are simple parts, so an exposed partitioned store-file with cluster-store-file to keep current ip-addresses



store of stores with universal-node-id=universal-store-id/local-node-id -> lookup service from store-id to instance

store-cluster: has only nodes of a file-cluster, but offers queries of wider cluster-index (with specific methods) returning file-cluster-id
offer also methods to query known nodes-id of same file-cluster and index-cluster
each node offers: its file list, list of nodes of same cluster with same files, 
some mappings <file-id, cluster-id> of index-partition-cluster and list of nodes of same cluster
-> todo: design extended node-store-cluster interface

content cluster is for audio and video streams of a movie
context cluster is for all files of a project
generalizing: each correlation/proximity cluster for each node of the global directory/graph
decorrelating clusters: shuffles files to put together unrelated ones to maximize resiliency

cluster priority: list of type of cluster to use when increasing file redundancy
eg if priority is 1-proximity,2-decorrelation and file-a has redundancy 1, then only lives on a proximity cluster, 
if file-b has redundancy 2, then first goes into a proximity cluster and then also in a decorrelating cluster

*/

//public interface StoreGraph extends Node
public interface StoreNode extends Store
{
  public String root() throws Exception;
  public void root(String id) throws Exception;
  
  // start from node-id, walk path, return id of last node on path
  public String nodeIDFromPath(String id, String path) throws Exception;
  default public String nodeIDFromPath(String path) throws Exception {return nodeIDFromPath(root(), path);}
  
  // all path search methods should be removed and put in a more complex interface because algs can be very complex
  // finds all existing minimum paths (with less possible nodes)
  public StreamObjectInput<String> pathsBetweenNodes(String idSource, String idDest) throws Exception;
  public StreamObjectInput<String> parentsBetweenNodes(String idSource, String idDest) throws Exception;
  default public StreamObjectInput<String> absolutePathsFromID(String id) throws Exception {return pathsBetweenNodes(root(), id);}
  // maybe to remove or maybe to rename as "reversePath" and make it simply reverse order
  public String pathFromReversePath(String reversePath) throws Exception;
  
  // returns list of parent nodes id
  public StreamObjectInput<String> parentNodes(String id) throws Exception;
  // returns list of paths that a parent has to node-id
  public StreamObjectInput<String> parentNodePaths(String id, String parentID) throws Exception;
  // returns unique list of unique lists (path/node-id) as single string (maybe better as collections/sets)
  public StreamObjectInput<String> parentPaths(String id) throws Exception;
  // returns list of nodes that links to node-id with a specific path
  public StreamObjectInput<String> parentPathNodes(String id, String path) throws Exception;
  // returns unique list of unique lists (path/node-id) as single string since forward path must be unique by definition
  public StreamObjectInput<String> childNodesByPath(String id) throws Exception;
  
  public void link(String parentID, String childID, String path) throws Exception;
  
  default public void unlink(String parentID, String childID) throws Exception
  {
    StreamObjectInput<String> stream = parentNodePaths(childID, parentID);
    
    while(!stream.eos())
    {
      unlink(parentID, childID, stream.readObject());
    }
    
    stream.close();
  }
  
  public void unlink(String parentID, String childID, String path) throws Exception;
}
