pragma solidity ^0.4.2;

contract Token { 
    
    

    function Transfer(address to, uint256 v);

    
    }

/// Le contrat Vote hérite de Token pour créer le monnaie locale : les points de fidélités
contract Vote is Token {
    
    
    struct Voter {
        uint weight;
        bool voted;
        uint8 vote;
        address delegate;
        uint PointFidelBalance;
    }
    
    struct Proposal {
        uint voteCount;
    }
    


    address chairperson;
    mapping(address => Voter) voters;
    Proposal[] proposals;
    
    modifier onlyChairperson{
        if (msg.sender != chairperson) throw;
        _;
    }
    
    
    /// Create a new ballot with $(_numProposals) different proposals.
    function Vote(uint8 _numProposals) {
        chairperson = msg.sender;
        voters[chairperson].weight = 1;
        proposals.length = _numProposals;
        Token t =Token(chairperson);        
    }

    /// Give $(voter) the right to vote on this ballot.
    /// May only be called by $(chairperson).
    function giveRightToVote(address voter) onlyChairperson {
        if (msg.sender != chairperson || voters[voter].voted) return;
        voters[voter].weight = 1;
    }

    /// Delegate your vote to the voter $(to).
    function delegate(address to) {
        Voter sender = voters[msg.sender]; // assigns reference
        if (sender.voted) return;
        while (voters[to].delegate != address(0) && voters[to].delegate != msg.sender)
            to = voters[to].delegate;
        if (to == msg.sender) return;
        sender.voted = true;
        sender.delegate = to;
        Voter delegate = voters[to];
        if (delegate.voted)
            proposals[delegate.vote].voteCount += sender.weight;
        else
            delegate.weight += sender.weight;
    }
    
    
    function Transfer(address a, uint v) onlyChairperson()
    {
        Voter vot1= voters[a];
        vot1.PointFidelBalance += v;
    }

    /// Give a single vote to proposal $(proposal).
    function votez(uint8 proposal) {
        Voter sender = voters[msg.sender];
        if (sender.voted || proposal >= proposals.length) return;
        sender.voted = true;
        sender.vote = proposal;
        proposals[proposal].voteCount += sender.weight;
        
        Transfer(sender.delegate, 15);

    }
    
    /// Enable the users to check if they win something with their fidelity points
    function Recompense(address a) returns (string affich) 
    {       
        Voter vot1= voters[a];
        if(vot1.PointFidelBalance > 60) affich = "Bravo vous avez gagnez un bon de réduction !";
        return affich;
    }

//event
//Determinate the proposal with the most votes
    function winningProposal() onlyChairperson constant returns (uint8 winningProposal)  {
        uint256 winningVoteCount = 0;
        for (uint8 proposal = 0; proposal < proposals.length; proposal++)
            if (proposals[proposal].voteCount > winningVoteCount) {
                winningVoteCount = proposals[proposal].voteCount;
                winningProposal = proposal;
            }
    }
}
