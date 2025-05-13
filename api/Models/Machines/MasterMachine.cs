using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using VCT.API.Models.Enums;

namespace VCT.API.Models.Machines
{
    public class MasterMachine : Machine
    {
        [Key]
        public int Id { get; set; }
        public string? Name { get; set; }
        [ForeignKey("Client")]
        public int ClientId { get; set; }
        public List<SatelliteMachine> SatelliteMachines { get; } = new List<SatelliteMachine>();

        public MasterMachine(){}

    }
}
